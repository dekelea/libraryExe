package com.interview.library.service;

import com.interview.library.repository.BookRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class BookServiceTest {


    @InjectMocks
    private BookService bookService;
    @Mock
    private BookRepository bookRepository;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void findAllEqualOrLessThan() {

        Pageable pageable = mock(Pageable.class);
        BigDecimal maxCheapBookPrice = new BigDecimal(5);
        bookService.findAllEqualOrLessThan(pageable, maxCheapBookPrice);
        verify(bookRepository).findBooksByPriceIsLessThanEqual(pageable, maxCheapBookPrice);
    }
}
