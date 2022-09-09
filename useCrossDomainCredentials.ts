import React, { useEffect } from "react";
export type AnyObject = Record<string, unknown>;

export interface CrossDomainCredentialsConfig {
  iframeId?: string;
  iframeUrl: string;
  handleLogout: () => void;
  onReadyCredentials: (data: AnyObject) => void;
}
export interface CrossDomainCredentialsMessageEvent extends MessageEvent {
  source: Window;
}

export const DefaultCrossDomainCredentialsId = "cross-domain-credentials";
export const CrossDomainCredentialsMessage = {
  REQUEST_CREDENTIALS: "request_credentials",
  RETURN_CREDENTIALS: "return_credentials",
  POST_LOGOUT: "post_logout",
  LOGOUT: "logout",
  SAVE_NEW_CREDENTIALS: "save_new_credentials",
  SAVE_CREDENTIALS: "save_credentials",
};

export function useCrossDomainCredentials(
  config: CrossDomainCredentialsConfig
) {
  const windowReady = typeof window !== "undefined";
  const loadConfig = React.useMemo(() => {
    return {
      iframeId: config.iframeId || DefaultCrossDomainCredentialsId,
      iframeUrl: config.iframeUrl,
    };
  }, [config]);

  const postMessage = React.useCallback(
    (message: AnyObject) => {
      const crossDomainCredentialsIframe =
        windowReady && document.getElementById(loadConfig.iframeId);
      if (crossDomainCredentialsIframe) {
        const iFrame = crossDomainCredentialsIframe as HTMLIFrameElement;
        iFrame.contentWindow?.postMessage(message, loadConfig.iframeUrl);
      }
    },
    [loadConfig.iframeId, loadConfig.iframeUrl, windowReady]
  );
  const getCredentials = React.useCallback(
    () =>
      new Promise((resolve) => {
        const handleCrossDomainCredentialsMessage = (event: MessageEvent) => {
          switch (event.data.name) {
            case CrossDomainCredentialsMessage.RETURN_CREDENTIALS: {
              window.removeEventListener(
                "message",
                handleCrossDomainCredentialsMessage
              );
              config.onReadyCredentials(event.data.data);
              resolve(event.data.data);
              break;
            }

            case CrossDomainCredentialsMessage.LOGOUT: {
              window.removeEventListener(
                "message",
                handleCrossDomainCredentialsMessage
              );
              config.handleLogout();
              resolve(null);
              break;
            }

            default: {
              break;
            }
          }
        };

        window.addEventListener("message", handleCrossDomainCredentialsMessage);
        postMessage({
          name: CrossDomainCredentialsMessage.REQUEST_CREDENTIALS,
        });
      }),
    [config, postMessage]
  );

  const removeCredentials = () =>
    new Promise<void>((resolve) => {
      const handleCrossDomainCredentialsMessage = (event: MessageEvent) => {
        switch (event.data.name) {
          case CrossDomainCredentialsMessage.LOGOUT: {
            window.removeEventListener(
              "message",
              handleCrossDomainCredentialsMessage
            );
            resolve();
            break;
          }

          default: {
            break;
          }
        }
      };

      window.addEventListener("message", handleCrossDomainCredentialsMessage);
      postMessage({
        name: CrossDomainCredentialsMessage.POST_LOGOUT,
      });
    });

  const setNewCredentials = (credentials: any) =>
    new Promise<void>((resolve) => {
      const handleCrossDomainCredentialsMessage = (event: MessageEvent) => {
        switch (event.data.name) {
          case CrossDomainCredentialsMessage.SAVE_CREDENTIALS: {
            window.removeEventListener(
              "message",
              handleCrossDomainCredentialsMessage
            );
            resolve();
            break;
          }

          default: {
            break;
          }
        }
      };

      window.addEventListener("message", handleCrossDomainCredentialsMessage);

      postMessage({
        name: CrossDomainCredentialsMessage.SAVE_NEW_CREDENTIALS,
        data: credentials,
      });
    });

  useEffect(() => {
    const fetchCredentials = async () => {
      await getCredentials();
    };
    if (windowReady && !document.getElementById(loadConfig.iframeId)) {
      const iframe = document.createElement("iframe");
      iframe.id = loadConfig.iframeId;
      iframe.src = loadConfig.iframeUrl;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      iframe.onload = () => {
        fetchCredentials();
      };
    }
  }, [getCredentials, loadConfig.iframeId, loadConfig.iframeUrl, windowReady]);

  return {
    getCredentials,
    removeCredentials,
    setNewCredentials,
  };
}

export default useCrossDomainCredentials;
