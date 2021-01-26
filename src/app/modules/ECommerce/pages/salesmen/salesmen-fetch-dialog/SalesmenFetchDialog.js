import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { SalesmanStatusCssClasses } from "../SalesmenUIHelpers";
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

export function SalesmenFetchDialog({ show, onHide }) {
  // Salesmen UI Context
  const salesmenUIContext = useSalesmenUIContext();
  const salesmenUIProps = useMemo(() => {
    return {
      ids: salesmenUIContext.ids,
    };
  }, [salesmenUIContext]);

  // Salesmen Redux state
  const { salesmen } = useSelector(
    (state) => ({
      salesmen: selectedSalesmen(
        state.salesmen.entities,
        salesmenUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if salesmen weren't selected we should close modal
  useEffect(() => {
    if (!salesmenUIProps.ids || salesmenUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesmenUIProps.ids]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Fetch selected elements
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="timeline timeline-5 mt-3">
          {salesmen.map((salesman) => (
            <div className="timeline-item align-items-start" key={`id${salesman.id}`}>
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
                <span className="ml-3">{salesman.lastName}, {salesman.firstName}</span>                
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
