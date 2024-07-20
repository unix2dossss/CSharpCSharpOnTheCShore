using w1_l2_ex2.Data;
using w1_l2_ex2.Model;

namespace w1_l2_ex2;

class Program
{
    static void Main(string[] args)
    {
        LibraryRepoImpl bs1 = new LibraryRepoImpl();
        IEnumerable<Book> books = bs1.GetBooks();

        foreach (Book book in books)
        {
            Console.WriteLine($"Title: {book.Title}");
            Console.WriteLine($"Author: {book.Author}");
            Console.WriteLine($"ISBN: {book.ISBN}");
            Console.WriteLine();
        }

        Book mynewbook = new Book()
        {
            Title="b3",
            Author="a3",
            ISBN="ISBN-3"
        };

        bs1.AddBook(mynewbook);
        Console.WriteLine("After Update:");
        foreach (Book book in books)
        {
            Console.WriteLine($"Title: {book.Title}");
            Console.WriteLine($"Author: {book.Author}");
            Console.WriteLine($"ISBN: {book.ISBN}");
            Console.WriteLine();
        }

    }

}
