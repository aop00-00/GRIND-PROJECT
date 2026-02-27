import { Link, Outlet, useLocation } from "react-router";
import {
    LayoutDashboard,
    Users,
    Calendar,
    DollarSign,
    ShoppingBag,
    LogOut,
    Settings
} from "lucide-react";

export default function AdminLayout() {
    const location = useLocation();

    const navigation = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
        { name: 'Finance', href: '/admin/finance', icon: DollarSign },
        { name: 'POS', href: '/admin/pos', icon: ShoppingBag },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider">ADMIN PANEL</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-3 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors mb-2"
                    >
                        <Settings className="w-5 h-5 mr-3" />
                        Switch to User View
                    </Link>
                    <form action="/auth/logout" method="post">
                        <button
                            type="submit"
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-900/20 hover:text-red-300 transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h1 className="font-bold">Admin Panel</h1>
                </div>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
            {/* Bottom Navigation for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-500'
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-xs mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
