using w2_l6_ex2.Data;
using w2_l6_ex2.Model;

namespace w2_l6_ex2;

class Program
{
    static void Main(string[] args)
    {
        CreateStudent(new Student { Id = 1, FirstName = "Vandan", LastName = "Bhatt", Address = "Auckland" });
    }

    public static void CreateStudent(Student student)
    {
        using (var dbContext = new StudentDbContext())
        {
            var s = dbContext.Students.FirstOrDefault<Student>(s => student.Id == s.Id);
            if (s == null)
            {
                dbContext.Students.Add(student);
                dbContext.SaveChanges();
            } else
            {
                Console.WriteLine($"Student with ID: {student.Id} already exists");
            }
        }
    }
}
