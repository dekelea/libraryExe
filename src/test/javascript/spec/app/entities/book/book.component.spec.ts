/* tslint:disable max-line-length */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data } from '@angular/router';

import { LibraryTestModule } from '../../../test.module';
import { BookComponent } from 'app/entities/book/book.component';
import { BookService } from 'app/entities/book/book.service';
import { Book } from 'app/shared/model/book.model';
import { By } from '@angular/platform-browser';
import { LibraryBookModule } from 'app/entities/book/book.module';

fdescribe('Component Tests', () => {
    describe('Book Management Component', () => {
        let comp: BookComponent;
        let fixture: ComponentFixture<BookComponent>;
        let service: BookService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [LibraryTestModule, LibraryBookModule],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            data: {
                                subscribe: (fn: (value: Data) => void) =>
                                    fn({
                                        pagingParams: {
                                            predicate: 'id',
                                            reverse: false,
                                            page: 0
                                        }
                                    })
                            }
                        }
                    }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(BookComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BookService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Book(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.books[0]).toEqual(jasmine.objectContaining({ id: 123 }));
            expect(comp.filterOnlyCheapBooks).toBeFalsy();
        });

        it('should load a page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Book(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.books[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });

        it('should not load a page is the page is the same as the previous page', () => {
            spyOn(service, 'query').and.callThrough();

            // WHEN
            comp.loadPage(0);

            // THEN
            expect(service.query).toHaveBeenCalledTimes(0);
        });

        it('should re-initialize the page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Book(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);
            comp.clear();

            // THEN
            expect(comp.page).toEqual(0);
            expect(service.query).toHaveBeenCalledTimes(2);
            expect(comp.books[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
        it('should calculate the sort attribute for an id', () => {
            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['id,desc']);
        });

        it('should calculate the sort attribute for a non-id attribute', () => {
            // GIVEN
            comp.predicate = 'name';

            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['name,desc', 'id']);
        });

        describe('when selecting to view only cheap books', () => {
            beforeEach(async(() => {
                fixture.detectChanges();
                return fixture.whenStable();
            }));
            let findAllSpy: jasmine.Spy;
            beforeEach(async(() => {
                findAllSpy = spyOn(comp, 'loadAll');
                const checkbox = fixture.debugElement.query(By.css('.spec-booksList__filterOnlyCheapBooks--select'));
                (checkbox.nativeElement as HTMLElement).click();
            }));

            it('should load the table', () => {
                expect(findAllSpy).toBeCalledTimes(1);
            });
            it('should flag that only cheap books are showing', () => {
                expect(comp.filterOnlyCheapBooks).toEqual(true);
            });
        });

        describe(' `findAll` API', () => {
            let bookServiceQuerySpy: jasmine.Spy;

            beforeEach(() => {
                bookServiceQuerySpy = spyOn(service, 'query').and.returnValue(of({}));
            });

            describe('when showing all books', () => {
                it('should call `bookService#query` with default page parameters', () => {
                    comp.loadAll();
                    expect(bookServiceQuerySpy).toBeCalledWith({
                        page: comp.page - 1,
                        size: comp.itemsPerPage,
                        sort: comp.sort()
                    });
                });
            });
        });
    });
});
