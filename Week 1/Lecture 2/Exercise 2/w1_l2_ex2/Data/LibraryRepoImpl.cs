using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using w1_l2_ex2.Model;

namespace w1_l2_ex2.Data
{
    internal class LibraryRepoImpl : ILibraryRepo
    {
        private List<Book> bookStore;

        public LibraryRepoImpl()
        {
            bookStore = new List<Book>();
            Book book1 = new Book()
            {
                Title = "b1",
                Author = "a1",
                ISBN = "ISBN-1"
            };

            Book book2 = new Book()
            {
                Title = "b2",
                Author = "a2",
                ISBN = "ISBN-2"
            };

            bookStore.Add(book1);
            bookStore.Add(book2);
        }

        public IEnumerable<Book> GetBooks()
        {
            return bookStore;
        }
    }
}