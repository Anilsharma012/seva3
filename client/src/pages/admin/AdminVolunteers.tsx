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
import { Loader2, Eye, Check, X, Trash2 } from "lucide-react";

interface Volunteer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  occupation?: string;
  skills?: string;
  availability?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  createdAt: string;
}

export default function AdminVolunteers() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: volunteers = [], isLoading } = useQuery<Volunteer[]>({
    queryKey: ["/api/admin/volunteers"],
    enabled: !!token,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      return apiRequest("PATCH", `/api/admin/volunteers/${id}`, { status, adminNotes: notes });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Volunteer status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/volunteers"] });
      setViewDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/volunteers/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Application deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/volunteers"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    },
  });

  const updateStatus = (id: number, status: string, notes?: string) => {
    updateMutation.mutate({ id, status, notes });
  };

  const deleteVolunteer = (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    deleteMutation.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected": return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const openViewDialog = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setAdminNotes(volunteer.adminNotes || "");
    setViewDialogOpen(true);
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
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Volunteer Applications</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12" data-testid="loading-spinner">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : volunteers.length === 0 ? (
          <Card data-testid="card-empty-state">
            <CardContent className="py-12 text-center text-muted-foreground">
              No volunteer applications yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4" data-testid="list-volunteers">
            {volunteers.map((volunteer) => (
              <Card key={volunteer.id} data-testid={`card-volunteer-${volunteer.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold" data-testid={`text-name-${volunteer.id}`}>{volunteer.fullName}</span>
                        {getStatusBadge(volunteer.status)}
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-email-${volunteer.id}`}>{volunteer.email}</p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-phone-${volunteer.id}`}>{volunteer.phone}</p>
                      {volunteer.city && <p className="text-sm text-muted-foreground">{volunteer.city}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="icon" variant="outline" onClick={() => openViewDialog(volunteer)} data-testid={`button-view-${volunteer.id}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-green-600" onClick={() => updateStatus(volunteer.id, "approved")} disabled={updateMutation.isPending} data-testid={`button-approve-${volunteer.id}`}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-600" onClick={() => updateStatus(volunteer.id, "rejected")} disabled={updateMutation.isPending} data-testid={`button-reject-${volunteer.id}`}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => deleteVolunteer(volunteer.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-${volunteer.id}`}>
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
          <DialogContent className="max-w-lg" data-testid="dialog-volunteer-details">
            <DialogHeader>
              <DialogTitle>Volunteer Application</DialogTitle>
            </DialogHeader>
            {selectedVolunteer && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> <span data-testid="text-detail-name">{selectedVolunteer.fullName}</span></div>
                  <div><strong>Email:</strong> <span data-testid="text-detail-email">{selectedVolunteer.email}</span></div>
                  <div><strong>Phone:</strong> <span data-testid="text-detail-phone">{selectedVolunteer.phone}</span></div>
                  <div><strong>City:</strong> <span data-testid="text-detail-city">{selectedVolunteer.city || "N/A"}</span></div>
                  <div><strong>Occupation:</strong> <span data-testid="text-detail-occupation">{selectedVolunteer.occupation || "N/A"}</span></div>
                  <div><strong>Availability:</strong> <span data-testid="text-detail-availability">{selectedVolunteer.availability || "N/A"}</span></div>
                </div>
                {selectedVolunteer.skills && (
                  <div><strong>Skills:</strong> <span data-testid="text-detail-skills">{selectedVolunteer.skills}</span></div>
                )}
                {selectedVolunteer.message && (
                  <div><strong>Message:</strong> <span data-testid="text-detail-message">{selectedVolunteer.message}</span></div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add notes..." data-testid="input-admin-notes" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status</label>
                  <Select defaultValue={selectedVolunteer.status} onValueChange={(value) => updateStatus(selectedVolunteer.id, value, adminNotes)}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
