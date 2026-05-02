export type ISubscription = {
    _id?: string;
    userId: string;
    email: string;
    tier: string;
    status: string;
    provider: string;
    providerSubscriptionId?: string;
    providerCustomerId?: string;
    currentPeriodEnd: Date;
    zoomJoinUrl?: string;
    zoomRegistrantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
};