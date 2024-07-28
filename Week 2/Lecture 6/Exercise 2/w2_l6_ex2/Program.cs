using w2_l6_ex2.Data;
using w2_l6_ex2.Model;

namespace w2_l6_ex2;

class Program
{
    static void Main(string[] args)
    {
        CreateStudent(new Student { Id = 1, FirstName = "Vandan", LastName = "Bhatt", Address = "Auckland" });
        var students = GetStudents();
        foreach (var student in students)
        {
            Console.WriteLine($"Id: {student.Id}, FirstName: {student.FirstName}, LastName: {student.LastName}, Address: {student.Address}");
        }

        UpdateStudent(new Student { Id = 1, FirstName = "Vandan", LastName = "Bhatt", Address = "Auckland, Papatoetoe" });
        DeleteStudent(new Student { Id = 1, FirstName = "Vandan", LastName = "Bhatt", Address = "Auckland, Papatoetoe" });

        students = GetStudents();
        foreach (var student in students)
        {
            Console.WriteLine($"Id: {student.Id}, FirstName: {student.FirstName}, LastName: {student.LastName}, Address: {student.Address}");
        }
        
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

    public static IEnumerable<Student> GetStudents()
    {
        using (var dbContext = new StudentDbContext())
        {
            return dbContext.Students.ToList<Student>();
        }
    }

    public static void UpdateStudent(Student student)
    {
        using (var dbContext = new StudentDbContext())
        {
            var selected_student = dbContext.Students.FirstOrDefault<Student>(s => s.Id == student.Id);
            if (selected_student != null)
            {
                selected_student.FirstName = student.FirstName;
                selected_student.LastName = student.LastName;
                selected_student.Address = student.Address;
                dbContext.SaveChanges();
            }
        }
    }

    public static void DeleteStudent(Student student)
    {
        using (var dbContext = new StudentDbContext())
        {
            dbContext.Students.Remove(student);
            dbContext.SaveChanges();
        }
    }
}