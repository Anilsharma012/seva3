import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Eye, Mail, Trash2 } from "lucide-react";

interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "pending" | "read" | "replied";
  adminNotes?: string;
  createdAt: string;
}

export default function AdminContactInquiries() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: inquiries = [], isLoading } = useQuery<ContactInquiry[]>({
    queryKey: ["/api/admin/contact-inquiries"],
    enabled: !!token,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      return apiRequest("PATCH", `/api/admin/contact-inquiries/${id}`, { status, adminNotes: notes });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Inquiry updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-inquiries"] });
      setViewDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/contact-inquiries/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Inquiry deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-inquiries"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    },
  });

  const updateStatus = (id: string, status: string, notes?: string) => {
    updateMutation.mutate({ id, status, notes });
  };

  const deleteInquiry = (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    deleteMutation.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "replied": return <Badge className="bg-green-500">Replied</Badge>;
      case "read": return <Badge className="bg-blue-500">Read</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const openViewDialog = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.adminNotes || "");
    setViewDialogOpen(true);
    if (inquiry.status === "pending") {
      updateStatus(inquiry._id, "read");
    }
  };

  if (!token) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground" data-testid="text-auth-required">Please log in to access this page.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Contact Inquiries</h1>
          <Badge variant="outline" data-testid="badge-count">{inquiries.length} Total</Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12" data-testid="loading-spinner">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : inquiries.length === 0 ? (
          <Card data-testid="card-empty-state">
            <CardContent className="py-12 text-center text-muted-foreground">
              No contact inquiries yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4" data-testid="list-inquiries">
            {inquiries.map((inquiry) => (
              <Card key={inquiry._id} data-testid={`card-inquiry-${inquiry._id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold" data-testid={`text-name-${inquiry._id}`}>{inquiry.name}</span>
                        {getStatusBadge(inquiry.status)}
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-email-${inquiry._id}`}>{inquiry.email}</p>
                      <p className="text-sm font-medium" data-testid={`text-subject-${inquiry._id}`}>Subject: {inquiry.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-message-${inquiry._id}`}>{inquiry.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="icon" variant="outline" onClick={() => openViewDialog(inquiry)} data-testid={`button-view-${inquiry._id}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" asChild data-testid={`button-email-${inquiry._id}`}>
                        <a href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => deleteInquiry(inquiry._id)} disabled={deleteMutation.isPending} data-testid={`button-delete-${inquiry._id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg" data-testid="dialog-inquiry-details">
            <DialogHeader>
              <DialogTitle>Contact Inquiry</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> <span data-testid="text-detail-name">{selectedInquiry.name}</span></div>
                  <div><strong>Email:</strong> <span data-testid="text-detail-email">{selectedInquiry.email}</span></div>
                  <div><strong>Phone:</strong> <span data-testid="text-detail-phone">{selectedInquiry.phone || "N/A"}</span></div>
                  <div><strong>Subject:</strong> <span data-testid="text-detail-subject">{selectedInquiry.subject}</span></div>
                </div>
                <div>
                  <strong>Message:</strong>
                  <p className="mt-1 p-3 bg-muted rounded-md text-sm" data-testid="text-detail-message">{selectedInquiry.message}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add notes..." data-testid="input-admin-notes" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status</label>
                  <Select defaultValue={selectedInquiry.status} onValueChange={(value) => updateStatus(selectedInquiry._id, value, adminNotes)}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button asChild className="w-full" data-testid="button-reply">
                  <a href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
