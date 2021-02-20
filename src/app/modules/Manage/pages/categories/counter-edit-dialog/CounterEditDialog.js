import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/categories/categoriesActions";
import { CounterEditDialogHeader } from "./CounterEditDialogHeader";
import { CounterEditForm } from "./CounterEditForm";
import { useCountersUIContext } from "../CountersUIContext";

export function CounterEditDialog({ id, show, onHide }) {
    // Counters UI Context
    const countersUIContext = useCountersUIContext();
    const countersUIProps = useMemo(() => {
        return {
            initCounter: countersUIContext.initCounter,
        };
    }, [countersUIContext]);

    // Counters Redux state
    const dispatch = useDispatch();
    const { actionsLoading, counterForEdit } = useSelector(
        (state) => ({
            actionsLoading: state.categories.actionsLoading,
            counterForEdit: state.categories.categoryForEdit,
        }),
        shallowEqual
    );

    useEffect(() => {
        // server call for getting Counter by id
        dispatch(actions.fetchCategory(id));
    }, [id, dispatch]);

    // server request for saving counter
    const saveCounter = (counter) => {
        if (!id) {
            // server request for creating counter
            dispatch(actions.createCategory(counter)).then(() => onHide());
        } else {
            // server request for updating counter
            dispatch(actions.updateCategory(counter)).then(() => onHide());
        }
    };

    return (
        <Modal
            size="lg"
            show={show}
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <CounterEditDialogHeader id={id} />
            <CounterEditForm
                saveCounter={saveCounter}
                actionsLoading={actionsLoading}
                counter={counterForEdit || countersUIProps.initCounter}
                onHide={onHide}
            />
        </Modal>
    );
}
