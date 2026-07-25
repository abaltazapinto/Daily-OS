import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

type AppShellProps = PropsWithChildren;

export function AppShell({ children }: AppShellProps) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
