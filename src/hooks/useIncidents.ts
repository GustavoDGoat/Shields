import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export interface IncidentData {
  _id: Id<"incidents">;
  _creationTime: number;
  studentId: string;
  incidentType: "phishing" | "malware" | "identity_theft" | "data_breach" | "unauthorized_access" | "other";
  description: string;
  status: "pending" | "investigating" | "resolved";
  urgencyLevel: "low" | "medium" | "high";
  evidenceUrl?: string;
  adminNote?: string;
  updatedAt?: string;
  studentName: string;
  studentEmail: string;
}

export const useIncidents = (userId: string | undefined, isAdmin: boolean) => {
  const incidents = useQuery(
    api.incidents.list,
    userId ? { userId, isAdmin } : "skip",
  );
  const generateUploadUrlMut = useMutation(api.incidents.generateUploadUrl);
  const createIncidentMut = useMutation(api.incidents.create);
  const updateStatusMut = useMutation(api.incidents.updateStatus);
  const addNoteMut = useMutation(api.incidents.addAdminNote);
  const deleteIncidentMut = useMutation(api.incidents.remove);

  const createIncident = async (data: {
    type: string;
    description: string;
    urgency: string;
    file?: File;
  }) => {
    if (!userId) throw new Error("User not authenticated");

    let evidenceStorageId: Id<"_storage"> | undefined;

    if (data.file) {
      const uploadUrl = await generateUploadUrlMut();
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: data.file,
      });
      if (!response.ok) {
        throw new Error("Failed to upload evidence file");
      }
      const { storageId } = (await response.json()) as { storageId: Id<"_storage"> };
      evidenceStorageId = storageId;
    }

    await createIncidentMut({
      studentId: userId,
      incidentType: data.type as any,
      description: data.description,
      urgencyLevel: data.urgency as any,
      evidenceStorageId,
    });

    toast.success("Incident reported successfully", {
      description: "Our security team will review your report shortly.",
    });
  };

  const updateIncidentStatus = async (id: string, status: string) => {
    if (!userId) return;
    const normalizedStatus = status.toLowerCase() as "pending" | "investigating" | "resolved";
    const allowedStatuses = ["pending", "investigating", "resolved"];

    if (!allowedStatuses.includes(normalizedStatus)) {
      toast.error("Invalid status value");
      return;
    }

    try {
      await updateStatusMut({
        id: id as Id<"incidents">,
        status: normalizedStatus,
        userId,
      });
      toast.success("Status updated", {
        description: `Incident status changed to ${normalizedStatus}.`,
      });
    } catch (error: any) {
      console.error("Error updating incident status:", error);
      toast.error("Failed to update status");
    }
  };

  const addAdminNote = async (id: string, note: string) => {
    if (!userId) return;
    try {
      await addNoteMut({ id: id as Id<"incidents">, note, userId });
      toast.success("Note saved", {
        description: "Your response has been added to the incident.",
      });
    } catch (error: any) {
      console.error("Error adding note:", error);
      toast.error("Failed to save note");
    }
  };

  const deleteIncident = async (id: string) => {
    if (!userId) return;
    try {
      await deleteIncidentMut({ id: id as Id<"incidents">, userId });
      toast.success("Incident deleted", {
        description: "The incident report has been removed.",
      });
    } catch (error: any) {
      console.error("Error deleting incident:", error);
      toast.error("Failed to delete incident");
    }
  };

  return {
    incidents: (incidents ?? []) as IncidentData[],
    loading: incidents === undefined,
    createIncident,
    updateIncidentStatus,
    addAdminNote,
    deleteIncident,
    refetch: () => {},
  };
};
