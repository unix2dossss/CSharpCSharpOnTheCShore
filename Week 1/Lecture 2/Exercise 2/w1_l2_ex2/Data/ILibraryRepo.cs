using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using w1_l2_ex2.Model;

namespace w1_l2_ex2.Data
{
    internal interface ILibraryRepo
    {
        public IEnumerable<Book> GetBooks();
    }
}
