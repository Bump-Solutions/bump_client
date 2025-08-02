import { useGeolocation } from "react-use";
import { useEffect, useState } from "react";
import { getAddressFromCoords } from "../../services/addressService";
import { toast } from "sonner";

export const useGetCurrentLocation = (
  onSuccess?: (resp: any) => void,
  onError?: (error: any) => void
) => {
  const geo = useGeolocation({ enableHighAccuracy: true });

  const [loading, isLoading] = useState(false);

  useEffect(() => {
    if (geo.latitude && geo.longitude) {
      isLoading(true);

      getAddressFromCoords(geo.latitude, geo.longitude)
        .then((data) => {
          if (data?.address && onSuccess) {
            onSuccess(data);
          }
        })
        .catch((error) => {
          if (onError) {
            onError(error);
          } else {
            toast.error("Nem sikerült meghatározni a címet.");
          }
        })
        .finally(() => {
          isLoading(false);
        });
    }
  }, [geo.latitude, geo.longitude]);

  return {
    loading: geo.loading || loading,
  };
};
