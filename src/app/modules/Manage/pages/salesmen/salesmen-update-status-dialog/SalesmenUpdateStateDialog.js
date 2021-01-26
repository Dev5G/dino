import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SalesmanStatusCssClasses } from "../SalesmenUIHelpers";
import * as actions from "../../../_redux/salesmen/salesmenActions";
import { useSalesmenUIContext } from "../SalesmenUIContext";

const selectedSalesmen = (entities, ids) => {
  const _salesmen = [];
  ids.forEach((id) => {
    const salesman = entities.find((el) => el.id === id);
    if (salesman) {
      _salesmen.push(salesman);
    }
  });
  return _salesmen;
};

export function SalesmenUpdateStateDialog({ show, onHide }) {
  // Salesmen UI Context
  const salesmenUIContext = useSalesmenUIContext();
  const salesmenUIProps = useMemo(() => {
    return {
      ids: salesmenUIContext.ids,
      setIds: salesmenUIContext.setIds,
      queryParams: salesmenUIContext.queryParams,
    };
  }, [salesmenUIContext]);

  // Salesmen Redux state
  const { salesmen, isLoading } = useSelector(
    (state) => ({
      salesmen: selectedSalesmen(
        state.salesmen.entities,
        salesmenUIProps.ids
      ),
      isLoading: state.salesmen.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!salesmenUIProps.ids || salesmenUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesmenUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update salesmen status by selected ids
    dispatch(actions.updateSalesmenStatus(salesmenUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchSalesmen(salesmenUIProps.queryParams)).then(
          () => {
            // clear selections list
            salesmenUIProps.setIds([]);
            // closing delete modal
            onHide();
          }
        );
      }
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Status has been updated for selected salesmen
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {/*begin::Loading*/}
        {isLoading && (
          <div className="overlay-layer">
            <div className="spinner spinner-lg spinner-primary" />
          </div>
        )}
        {/*end::Loading*/}

        <div className="timeline timeline-5 mt-3">
          {salesmen.map((salesman) => (
            <div
              className="timeline-item align-items-start"
              key={`salesmenUpdate${salesman.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    SalesmanStatusCssClasses[salesman.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    SalesmanStatusCssClasses[salesman.status]
                  } label-inline`}
                >
                  ID: {salesman.id}
                </span>
                <span className="ml-3">
                  {salesman.lastName}, {salesman.firstName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="form">
        <div className="form-group">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(+e.target.value)}
          >
            <option value="0">Suspended</option>
            <option value="1">Active</option>
            <option value="2">Pending</option>
          </select>
        </div>
        <div className="form-group">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={updateStatus}
            className="btn btn-primary btn-elevate"
          >
            Update Status
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
