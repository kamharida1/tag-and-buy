import {
  ComponentProps,
  Ref,
  forwardRef,
  memo,
  useEffect,
  useState,
} from "react";
import { ImageBackground } from "react-native";
import { supabase } from "../../lib/supabase";
import { CacheManager } from "react-native-expo-image-cache";

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
  children?: React.ReactNode;
} & Omit<ComponentProps<typeof ImageBackground>, "source">;

const RemoteImage = forwardRef(
  (props: RemoteImageProps, ref: Ref<ImageBackground>) => {
    const { path, fallback, children, ...imageProps } = props;
    const [image, setImage] = useState("");

    useEffect(() => {
      if (!path) return;
      (async () => {
        const { data } = await supabase.storage
          .from("product-images")
          .getPublicUrl(path as string);

        if (data) {
          const url = data.publicUrl;
          const cached = (await CacheManager.get(url, {}).getPath()) ?? "";
          setImage(cached);
        }
      })();
    }, [path]);

    return (
      <ImageBackground
        ref={ref}
        source={{ uri: image || fallback }}
        {...imageProps}
      >
        {children}
      </ImageBackground>
    );
  }
);

export { RemoteImage };
