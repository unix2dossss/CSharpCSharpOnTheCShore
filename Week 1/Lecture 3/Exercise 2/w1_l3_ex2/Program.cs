using System.Data;

namespace w1_l3_ex2;

public delegate int Operation(int a, int b);

class Program
{

    static void Main(string[] args)
    {
        int add1 =  Addition(3, 4);
        int sub1 = Subtraction(4, 3);

        //Console.WriteLine(add1);
        //Console.WriteLine(sub1);

        Operation op1;
        op1 = Addition;
        Operation op2 = new Operation(Subtraction);

        int out1 = PerformOperation(op1, 3, 2);
        int out2 = PerformOperation(op2, 3, 2);

        Console.WriteLine($"Performing addition: {out1}");
        Console.WriteLine($"Performing subtraction: {out2}");
    }

    public static int Addition(int a, int b) { return a + b; }
    
    public static int Subtraction(int a, int b) { return a - b; }

    public static int PerformOperation(Operation x, int a, int b) { 
        int output = x(a, b);
        return output;
    }
}
