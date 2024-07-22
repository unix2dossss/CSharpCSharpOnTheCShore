namespace w2_l1_ex3;

class Program
{
    static void Main(string[] args)
    {
        List<Person> people = new List<Person>()
        {
            new Person(){Name="Alice", Role="Manager", Age=19},
            new Person(){Name="Bob", Role="Developer", Age=43},
            new Person(){Name="Charlie", Role="Designer", Age=23},
            new Person(){Name="Alice", Role="Analyst", Age=36},
            new Person(){Name="Eve", Role="Tester", Age=61},
        };

        var mapping = people.Select(e => new {Name=e.Name, Role=e.Role});

        foreach (var person in mapping)
        {
            Console.WriteLine($"Name: {person.Name}, Role: {person.Role}");
        }
    }
}
