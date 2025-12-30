export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
  maxUploadMB: parseFloat(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB ?? "0"),
};
