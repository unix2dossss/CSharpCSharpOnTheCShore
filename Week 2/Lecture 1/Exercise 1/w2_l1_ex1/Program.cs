namespace w2_l1_ex1;

class Program
{
    static void Main(string[] args)
    {
        List<Person> people = new List<Person>()
        {
            new Person(){Name="Vandan", Age=19},
            new Person(){Name="Krupa", Age=43},
            new Person(){Name="Snehal", Age=52}
        };

        IEnumerable<Person> over30 = people.Where<Person>(e => e.Age > 30);

        foreach (Person p in over30)
        {
            Console.WriteLine($"Name: {p.Name}, Age: {p.Age} ");
        }
    }
}
