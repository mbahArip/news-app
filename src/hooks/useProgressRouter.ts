import { useRouter as useNextRouter } from "next/navigation";
import NProgress from "nprogress";

export default function usePRouter() {
  const router = useNextRouter();
  const { push, replace } = router;

  router.push = (...args) => {
    NProgress.start();
    push(...args);
  };

  router.replace = (...args) => {
    NProgress.start();
    replace(...args);
  };

  return router;
}
