/** Hostname of SUPABASE_URL, so covers also work with a custom Supabase domain. */
function supabaseHostname() {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
}

const storagePath = "/storage/v1/object/public/**";
const customHost = supabaseHostname();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Post covers uploaded from the admin panel live in Supabase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: storagePath },
      ...(customHost && !customHost.endsWith(".supabase.co")
        ? [{ protocol: "https", hostname: customHost, pathname: storagePath }]
        : []),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
