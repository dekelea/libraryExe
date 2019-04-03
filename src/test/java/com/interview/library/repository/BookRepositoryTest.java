package com.interview.library.repository;

import com.google.common.collect.Lists;
import com.interview.library.LibraryApp;
import com.interview.library.domain.Book;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.stream.Collectors;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = LibraryApp.class)
public class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Test
    @Transactional
    public void findBooksByPriceIsLessThanEqual() {
        BigDecimal maxBookPrice = new BigDecimal(20);

        Book bookWithMaxCheapBookPrice = createBook("bookWithMaxCheapBookPrice", maxBookPrice);
        Book bookWithPriceLowerThanThreshold = createBook("bookWithPriceLowerThanThreshold", maxBookPrice.subtract(new BigDecimal(0.1)));
        createBook("bookWithPriceHigherThanThreshold", maxBookPrice.add(new BigDecimal(0.1)));
        Collection<Book> expectedBooksToBeReturned = Lists.newArrayList(bookWithMaxCheapBookPrice, bookWithPriceLowerThanThreshold);

        final PageRequest pageable = PageRequest.of(0, (int) bookRepository.count());
        Page<Book> returnedBooks = bookRepository.findBooksByPriceIsLessThanEqual(pageable, maxBookPrice);

        assertEqualByIds(expectedBooksToBeReturned, returnedBooks.getContent());
    }

    private void assertEqualByIds(Collection<Book> expectedBooks, Collection<Book> actualBooks) {
        Assert.assertEquals(toIds(expectedBooks), toIds(actualBooks));
    }

    private Collection<Long> toIds(Collection<Book> books) {
        return books.stream().map(Book::getId).collect(Collectors.toList());
    }

    private Book createBook(String title, BigDecimal price) {
        Book book = new Book().title(title).price(price);
        bookRepository.saveAndFlush(book);
        return book;
    }
}
