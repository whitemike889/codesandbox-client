import { AsyncAction, Action } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { CurrentUser } from '@codesandbox/common/lib/types';

export const patronMounted: AsyncAction = withLoadApp();

export const priceChanged: Action<{ price: number }> = (
  { state },
  { price }
) => {
  state.patron.price = price;
};

export const createSubscriptionClicked: AsyncAction<{
  token: string;
  coupon: string;
}> = async ({ state, effects }, { token, coupon }) => {
  effects.analytics.track('Create Patron Subscription');
  state.patron.error = null;
  state.patron.isUpdatingSubscription = true;
  try {
    state.user = await effects.api.createPatronSubscription(
      token,
      state.patron.price,
      coupon
    );
    effects.notificationToast.error('Thank you very much for your support!');
  } catch (error) {
    state.patron.error = error.message;
  }
  state.patron.isUpdatingSubscription = false;
};

export const updateSubscriptionClicked: AsyncAction<{
  coupon: string;
}> = async ({ state, effects }, { coupon }) => {
  effects.analytics.track('Update Patron Subscription');
  state.patron.error = null;
  state.patron.isUpdatingSubscription = true;
  try {
    state.user = await effects.api.updatePatronSubscription(
      state.patron.price,
      coupon
    );
    effects.notificationToast.success(
      'Subscription updated, thanks for helping out!'
    );
  } catch (error) {
    state.patron.error = error.message;
  }
  state.patron.isUpdatingSubscription = false;
};

export const cancelSubscriptionClicked: AsyncAction = async ({
  state,
  effects,
}) => {
  effects.analytics.track('Cancel Subscription');
  if (
    effects.browser.confirm(
      'Are you sure you want to cancel your subscription?'
    )
  ) {
    state.patron.error = null;
    state.patron.isUpdatingSubscription = true;

    try {
      state.user = await effects.api.cancelPatronSubscription();
      effects.notificationToast.success(
        'Sorry to see you go, but thanks a bunch for the support this far!'
      );
    } catch (error) {}

    state.patron.isUpdatingSubscription = false;
  }
};

export const tryAgainClicked: Action = ({ state }) => {
  state.patron.error = null;
};
