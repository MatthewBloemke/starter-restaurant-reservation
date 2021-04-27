import React from "react";
import NewReservation from "../NewReservation/NewReservation"
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewTable from "../tables/NewTable"
import SeatReservation from "../NewReservation/SeatReservation";
import Search from "../phoneSearch/Search"
import EditReservation from "../NewReservation/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation/>
      </Route>
      <Route path="/search">
        <Search/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
