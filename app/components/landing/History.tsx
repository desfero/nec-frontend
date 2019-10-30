import { ErrorMessage, Field, Form, Formik } from "formik";
import * as React from "react";
import { Route } from "react-router-dom";
import { compose } from "recompose";
import { object } from "yup";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { EthereumAddress } from "../../types";
import { ethereumAddress } from "../../utils/yupSchemas";
import { AddressHistory } from "./AddressHistory";
import { landingRoutes } from "./landingRoutes";

type TDispatchProps = {
  goToAddressHistory: (address: EthereumAddress) => void;
};

const schema = object({
  address: ethereumAddress.required(),
});

const HistoryLayout: React.FunctionComponent<TDispatchProps> = ({ goToAddressHistory }) => (
  <>
    <Formik
      initialValues={{ address: "" }}
      validationSchema={schema}
      onSubmit={values => {
        goToAddressHistory(values.address as EthereumAddress);
      }}
    >
      {({ isValid }) => (
        <Form>
          <Field type="text" name="address" placeholder="Ethereum address..." />
          <ErrorMessage name="address" component="div" />

          <button type="submit" disabled={!isValid}>
            Load
          </button>
        </Form>
      )}
    </Formik>

    <Route
      path={landingRoutes.addressHistory}
      render={({ match }) => <AddressHistory address={match.params.address} />}
    />
  </>
);

const History = compose<TDispatchProps, {}>(
  appConnect<{}, TDispatchProps>({
    dispatchToProps: dispatch => ({
      goToAddressHistory: (address: EthereumAddress) =>
        dispatch(actions.routing.goToAddressHistory(address)),
    }),
  }),
)(HistoryLayout);

export { History };
