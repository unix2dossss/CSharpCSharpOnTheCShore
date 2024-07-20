namespace w1_l2_ex1;

class Program
{
    static void Main(string[] args)
    {
        Car car1 = new Car()
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            NumberOfDoors = 4,
            Type="Normal"
        };

        Motorcycle mc1 = new Motorcycle() 
        {
            Make = "Honda",
            Model = "CBR600RR",
            Year = 2019
        };

        Console.WriteLine("Car Information:");
        car1.DisplayInfo();

        Console.WriteLine("Motorcycle Information:");
        mc1.DisplayInfo();

        car1.Drive();
        mc1.Ride();
    }
}
