import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export interface PhishingSimulationRow {
  _id: Id<"phishingSimulations">;
  _creationTime: number;
  title: string;
  description: string;
  difficultyLevel: string;
  content: Record<string, unknown>;
  isPhishing: boolean;
  createdBy: Id<"users">;
}

export interface SimulationFormData {
  title: string;
  description: string;
  difficultyLevel: string;
  content: Record<string, unknown>;
  isPhishing: boolean;
}

export const usePhishingSimulations = () => {
  const simulations = useQuery(api.phishingSimulations.list);
  const createSimulationMut = useMutation(api.phishingSimulations.create);
  const updateSimulationMut = useMutation(api.phishingSimulations.update);
  const deleteSimulationMut = useMutation(api.phishingSimulations.remove);

  const createSimulation = async (formData: SimulationFormData) => {
    try {
      await createSimulationMut({
        title: formData.title,
        description: formData.description,
        difficultyLevel: formData.difficultyLevel,
        content: formData.content,
        isPhishing: formData.isPhishing,
      });
      toast.success("Simulation created");
      return true;
    } catch (error) {
      toast.error("Failed to create simulation");
      console.error(error);
      return false;
    }
  };

  const updateSimulation = async (id: string, formData: SimulationFormData) => {
    try {
      await updateSimulationMut({
        id: id as Id<"phishingSimulations">,
        title: formData.title,
        description: formData.description,
        difficultyLevel: formData.difficultyLevel,
        content: formData.content,
        isPhishing: formData.isPhishing,
      });
      toast.success("Simulation updated");
      return true;
    } catch (error) {
      toast.error("Failed to update simulation");
      console.error(error);
      return false;
    }
  };

  const deleteSimulation = async (id: string) => {
    try {
      await deleteSimulationMut({ id: id as Id<"phishingSimulations"> });
      toast.success("Simulation deleted");
      return true;
    } catch (error) {
      toast.error("Failed to delete simulation");
      console.error(error);
      return false;
    }
  };

  return {
    simulations: (simulations ?? []) as PhishingSimulationRow[],
    loading: simulations === undefined,
    createSimulation,
    updateSimulation,
    deleteSimulation,
  };
};
