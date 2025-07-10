import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { contactusEndpoint } from "../apis";
import { setLoading } from "../../slices/authSlice"; 

export function submitContactForm(data, reset) {
  return async (dispatch) => {
    dispatch(setLoading(true)); // Start loading
    const toastId = toast.loading("Sending message...");

    try {
      const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Message sent successfully!");
      reset(); // Reset form on success

      return { success: true, message: "Message sent successfully!" };
    } catch (error) {
      console.error("CONTACT FORM ERROR:", error);
      toast.error(error.message || "Failed to send message.");
      return { success: false, message: error.message || "Something went wrong." };
    } finally {
      dispatch(setLoading(false)); // Stop loading
      toast.dismiss(toastId);
    }
  };
}
