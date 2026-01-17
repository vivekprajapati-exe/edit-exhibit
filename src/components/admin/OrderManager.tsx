import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
    RefreshCw,
    Mail,
    Search,
    Package,
    IndianRupee,
    ShoppingCart,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';

interface Order {
    id: string;
    user_email: string;
    product_id: string;
    purchase_date: string;
    status: string;
    payment_id: string | null;
    amount: number;
    product?: {
        name: string;
        is_free: boolean;
    };
}

interface OrderStats {
    total: number;
    completed: number;
    pending: number;
    revenue: number;
}

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [resendingId, setResendingId] = useState<string | null>(null);
    const [stats, setStats] = useState<OrderStats>({ total: 0, completed: 0, pending: 0, revenue: 0 });
    const { toast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          product:products(name, is_free)
        `)
                .order('purchase_date', { ascending: false });

            if (error) throw error;

            const ordersData = data || [];
            setOrders(ordersData);

            // Calculate stats
            const completed = ordersData.filter(o => o.status === 'completed').length;
            const pending = ordersData.filter(o => o.status === 'pending').length;
            const revenue = ordersData
                .filter(o => o.status === 'completed')
                .reduce((sum, o) => sum + (o.amount || 0), 0);

            setStats({
                total: ordersData.length,
                completed,
                pending,
                revenue
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to fetch orders: " + error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendDownloadLink = async (order: Order) => {
        if (!order.product) return;

        setResendingId(order.id);
        try {
            // Get the product details to get the file path
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('file_path_in_storage, name')
                .eq('id', order.product_id)
                .single();

            if (productError) throw productError;

            // Call the send-free-asset edge function to resend the download link
            const { data, error } = await supabase.functions.invoke('send-free-asset', {
                body: {
                    email: order.user_email,
                    productName: product.name,
                    filePath: product.file_path_in_storage,
                    isResend: true
                }
            });

            if (error) throw error;

            // Log the resend
            await supabase.from('email_logs').insert({
                user_email: order.user_email,
                product_name: product.name,
                status: 'sent'
            });

            toast({
                title: "Success",
                description: `Download link resent to ${order.user_email}`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to resend download link: " + error.message,
                variant: "destructive",
            });

            // Log the failed attempt
            if (order.product) {
                await supabase.from('email_logs').insert({
                    user_email: order.user_email,
                    product_name: order.product.name,
                    status: 'failed',
                    error_message: error.message
                });
            }
        } finally {
            setResendingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'failed':
                return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredOrders = orders.filter(order =>
        order.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.payment_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bebas text-foreground tracking-wider">ORDER MANAGEMENT</h2>
                    <p className="text-muted-foreground text-sm mt-1">View and manage customer orders</p>
                </div>
                <Button
                    onClick={fetchOrders}
                    variant="outline"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Completed</p>
                                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Pending</p>
                                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-foreground flex items-center">
                                    <IndianRupee className="w-5 h-5" />
                                    {stats.revenue.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <IndianRupee className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by email, product name, or payment ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-bebas tracking-wide">ALL ORDERS</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {/* Table Header Skeleton */}
                            <div className="grid grid-cols-6 gap-4 pb-4 border-b border-border">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            {/* Table Rows Skeleton */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="grid grid-cols-6 gap-4 py-3 border-b border-border/50">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-8 w-16 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-bebas text-muted-foreground mb-2 tracking-wide">
                                {searchTerm ? 'NO ORDERS FOUND' : 'NO ORDERS YET'}
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? 'Try a different search term' : 'Orders will appear here when customers make purchases'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer Email</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-border"
                                        >
                                            <TableCell>{order.user_email}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-muted-foreground" />
                                                    <span>{order.product?.name || 'Unknown Product'}</span>
                                                    {order.product?.is_free && (
                                                        <Badge variant="outline" className="text-xs">Free</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {order.amount > 0 ? (
                                                    <span className="flex items-center">
                                                        <IndianRupee className="w-3 h-3" />
                                                        {order.amount}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">Free</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {order.purchase_date
                                                    ? new Date(order.purchase_date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : 'N/A'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={resendingId === order.id}
                                                        >
                                                            {resendingId === order.id ? (
                                                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                                            ) : (
                                                                <Mail className="w-3 h-3 mr-1" />
                                                            )}
                                                            Resend
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Resend Download Link</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will generate a new download link (valid for 7 days) and send it to <span className="text-foreground">{order.user_email}</span>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleResendDownloadLink(order)}>
                                                                Send Download Link
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderManager;
