import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import Link from "next/link"

interface ContactTransactionsProps {
  contactId: string
}

export function ContactTransactions({ contactId }: ContactTransactionsProps) {
  // Mock data - in a real app, this would come from an API
  const transactions = [
    {
      id: "TX-1234",
      address: "123 Main St, Anytown, CA 90210",
      type: "Purchase",
      status: "Active",
      role: "Buyer",
      date: "Mar 15, 2025",
      price: "$750,000",
    },
    {
      id: "TX-1237",
      address: "456 Oak Ave, Somewhere, CA 90211",
      type: "Sale",
      status: "Closed",
      role: "Seller",
      date: "Jan 10, 2025",
      price: "$925,000",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Transactions</h3>
        <Button size="sm">Add to Transaction</Button>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No transactions found for this contact.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <div
                className={`h-1 w-full ${
                  transaction.status === "Active"
                    ? "bg-green-500"
                    : transaction.status === "Pending"
                      ? "bg-amber-500"
                      : transaction.status === "Closed"
                        ? "bg-purple-500"
                        : "bg-gray-500"
                }`}
              ></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{transaction.address}</h4>
                    <div className="text-sm text-muted-foreground">{transaction.id}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      transaction.status === "Active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : transaction.status === "Pending"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : transaction.status === "Closed"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Type</div>
                    <div>{transaction.type}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Role</div>
                    <div>{transaction.role}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Date</div>
                    <div>{transaction.date}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Price</div>
                    <div>{transaction.price}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                    <Link href={`/transactions/${transaction.id}`}>
                      <Building2 className="h-4 w-4" />
                      View Transaction
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
