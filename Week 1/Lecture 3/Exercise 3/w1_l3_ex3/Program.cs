namespace w1_l3_ex3;

class Program
{
    static void Main(string[] args)
    {
        List<Person> people = new List<Person>();
        Person vandan = new Person() { Name = "Vandan", Age = 19 };
        Person riddhi = new Person() { Name = "Riddhi", Age = 24 };
        Person tanish = new Person() { Name = "Tanish", Age = 21 };
        Person john = new Person() { Name = "John", Age = 23 };
        people.Add(vandan);
        people.Add(riddhi);
        people.Add(tanish);
        people.Add(john);

        Person? p = people.FirstOrDefault<Person>(e => e.Age == 30);
        
        if (p != null)
        {
            Console.WriteLine($"First person over 30: {p.Name}, Age: {p.Name}");
        } else
        {
            Console.WriteLine("No person found with age greater than 30.");
        }
    }
}
