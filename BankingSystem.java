public class BankingSystem {
    private String owner;
    private double balance;

    public BankingSystem(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
        }
    }

    public double getBalance() {
        return balance;
    }

    public void displayAccountInfo() {
        System.out.println("Account Owner: " + owner);
        System.out.println("Account Balance: $" + balance);
    }

    public static void main(String[] args) {
        BankingSystem userAccount = new BankingSystem("John Doe", 1000.0);
        userAccount.displayAccountInfo();

        userAccount.deposit(500.0);
        userAccount.displayAccountInfo();

        userAccount.withdraw(300.0);
        userAccount.displayAccountInfo();

        System.out.println("\nCurrent Balance: $" + userAccount.getBalance());
    }
}
