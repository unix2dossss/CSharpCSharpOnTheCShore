namespace w2_l1_ex2;

class Program
{
    static void Main(string[] args)
    {
        List<Employee> employees = new List<Employee>()
        {
            new Employee() {Name="Vandan", Department="IT", Salary=40000},
            new Employee() {Name="Charan", Department="Sales", Salary=55000},
            new Employee() {Name="Sai", Department="Sales", Salary=60000},
        };

        IEnumerable<Employee> salesOver50k = employees.Where<Employee>(e => (e.Department == "Sales") && (e.Salary > 50000));

        foreach (Employee e in salesOver50k) {
            Console.WriteLine($"Name: {e.Name}, Department: {e.Department}, Salary: ${e.Salary}");
        }
    }
}
