using System.Data;

namespace w1_l3_ex2;

public delegate int Operation(int a, int b);

class Program
{

    static void Main(string[] args)
    {
        int add1 =  Addition(3, 4);
        int sub1 = Subtraction(4, 3);

        Console.WriteLine(add1);
        Console.WriteLine(sub1);
    }

    public static int Addition(int a, int b) { return a + b; }
    
    public static int Subtraction(int a, int b) { return a - b; }

    public static int PerformOperation(Operation x, int a, int b) { 
        int output = x(a, b);
        return output;
    }
}
