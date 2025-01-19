import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

export default function Dashboard() {
    return (
        <div>
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500">Welcome back, Admin!</p>
            </header>

            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-sidebar shadow-md">
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-muted-foreground">
                            Total Users
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-500">
                            1,234
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-sidebar shadow-md">
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-muted-foreground">
                            New Registrations
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-500">56</p>
                    </CardContent>
                </Card>

                <Card className="bg-sidebar shadow-md">
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-muted-foreground">
                            Pending Requests
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-500">8</p>
                    </CardContent>
                </Card>
            </section>

            {/* Recent Activity */}
            <section className="bg-sidebar p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-muted-foreground mb-4">
                    Recent Activity
                </h2>
                <ul className="divide-y divide-gray-200">
                    <li className="py-3">
                        <p className="text-muted-foreground font-medium">
                            User A logged in
                        </p>
                        <p className="text-muted-foreground text-sm">
                            2 hours ago
                        </p>
                    </li>
                    <li className="py-3">
                        <p className="text-muted-foreground font-medium">
                            User B registered
                        </p>
                        <p className="text-muted-foreground text-sm">
                            3 hours ago
                        </p>
                    </li>
                    <li className="py-3">
                        <p className="text-muted-foreground font-medium">
                            Admin approved request
                        </p>
                        <p className="text-muted-foreground text-sm">
                            5 hours ago
                        </p>
                    </li>
                </ul>
            </section>
        </div>
    );
}
