namespace w2_l1_ex4;

class Program
{
    static void Main(string[] args)
    {
        List<Person> people = new List<Person>() {
            new Person(){Name="Bob", Age=35},
            new Person(){Name="Charlie", Age=30},
            new Person(){Name="Alice", Age=25},
            new Person(){Name="Eve", Age=30},
            new Person(){Name="David", Age=20},
        };

        IEnumerable<Person> ascendingPeople = people.OrderBy(e => e.Age).ThenBy(e => e.Name);

        Console.WriteLine("Sorted list of persons:");

        foreach (Person p in ascendingPeople)
        {
            Console.WriteLine($"Name: {p.Name}, Age: {p.Age}");
        }
    }
}
