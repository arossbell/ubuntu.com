import { getUserSubscriptions } from "advantage/api/contracts";
import { UserSubscriptionType } from "advantage/api/enum";
import {
  UserSubscription,
  UserSubscriptionStatuses,
} from "advantage/api/types";
import { useQuery, UseQueryOptions } from "react-query";

/**
 * Find the subscription that matches the free token.
 */
export const selectFreeSubscription = (subscriptions: UserSubscription[]) =>
  subscriptions.find(
    (subscription) => subscription.type === UserSubscriptionType.Free
  ) || null;

/**
 * Whether there is a subscription with the provided status.
 */
const hasStatus = (
  subscriptions: UserSubscription[],
  status: keyof UserSubscriptionStatuses
) => subscriptions.some(({ statuses }) => statuses[status]);

/**
 * Get a summary of statuses for all subscriptions.
 */
export const selectStatusesSummary = (
  subscriptions: UserSubscription[]
): UserSubscriptionStatuses => ({
  is_cancellable: hasStatus(subscriptions, "is_cancellable"),
  is_cancelled: hasStatus(subscriptions, "is_cancelled"),
  is_downsizeable: hasStatus(subscriptions, "is_downsizeable"),
  is_expired: hasStatus(subscriptions, "is_expired"),
  is_expiring: hasStatus(subscriptions, "is_expiring"),
  is_in_grace_period: hasStatus(subscriptions, "is_in_grace_period"),
  is_renewable: hasStatus(subscriptions, "is_renewable"),
  is_trialled: hasStatus(subscriptions, "is_trialled"),
  is_upsizeable: hasStatus(subscriptions, "is_upsizeable"),
});
export const useUserSubscriptions = <D = UserSubscription[]>(
  options?: UseQueryOptions<UserSubscription[], unknown, D>
) => {
  const query = useQuery(
    "userSubscriptions",
    async () => await getUserSubscriptions(),
    options
  );
  return query;
};
