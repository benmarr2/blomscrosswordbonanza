interface ConnectionBannerProps {
  connected: boolean;
}

export function ConnectionBanner({ connected }: ConnectionBannerProps) {
  return (
    <div className={`connection-banner ${connected ? 'connection-banner--ok' : 'connection-banner--bad'}`}>
      <span className="connection-banner__dot" />
      {connected ? 'Live' : 'Reconnecting… edits will sync once back online'}
    </div>
  );
}
