/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React, {useMemo, useState} from "react";
import {Formik} from "formik";
import {get, merge} from "lodash";
import {FormHelperText, Switch} from "@material-ui/core";
import clsx from "clsx";
import {useHtmlClassService, setLayoutConfig, getInitLayoutConfig} from "../../layout";
import { Notice} from "../controls";
import axios from 'axios'

const localStorageActiveTabKey = "SettingsActiveTab";

export function Settings() {
    const activeTab = localStorage.getItem(localStorageActiveTabKey);
    const [key, setKey] = useState(activeTab ? +activeTab : 0);
    const [isLoading, setIsLoading] = useState(false);
    const htmlClassService = useHtmlClassService();
    const initialValues = useMemo(
        () =>
            merge(
                // Fulfill changeable fields.
                getInitLayoutConfig(),
                htmlClassService.config
            ),
        [htmlClassService.config]
    );

    const saveCurrentTab = (_tab) => {
        localStorage.setItem(localStorageActiveTabKey, _tab);
    }
    const handleData = (e) => {
        const file = e.target.files[0]
        const data = new FormData()
        data.append('file',file)
        axios.post('/api/v1.0/nest/import-data',data)
        .then(r => {
            console.log('Response',r.data)
        })
        .catch(e => {
            console.log(e.data)
        })
    }
    return (
        <>
            <Notice svg="/media/svg/icons/General/Smile.svg">
                <p>
                    We are working on this project to make it better every day! we hope you enjoy managing your business with ease.
                </p>
            </Notice>
            {/*Formic off site: https://jaredpalmer.com/formik/docs/overview*/}
            <Formik
                initialValues={initialValues}
                onSubmit={values => {
                    setIsLoading(true);
                    setLayoutConfig(values);
                }}
                onReset={() => {
                    setIsLoading(true);
                    setLayoutConfig(getInitLayoutConfig());
                }}
            >
                {({values, handleReset, handleSubmit, handleChange, handleBlur}) => (
                    <>
                        <div className="card card-custom">
                            {/*Header*/}
                            <div className="card-header card-header-tabs-line">
                                <ul
                                    className="nav nav-dark nav-bold nav-tabs nav-tabs-line"
                                    data-remember-tab="tab_id"
                                    role="tablist"
                                >
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${key === 0 ? "active" : ""}`}
                                            data-toggle="tab"
                                            onClick={() => {
                                                setKey(0);
                                                saveCurrentTab(0);
                                            }}
                                        >
                                            Header
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${key === 1 ? "active" : ""}`}
                                            data-toggle="tab"
                                            onClick={() => {
                                                setKey(1);
                                                saveCurrentTab(1);
                                            }}
                                        >
                                            Subheader
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${key === 2 ? "active" : ""}`}
                                            data-toggle="tab"
                                            onClick={() => {
                                                setKey(2);
                                                saveCurrentTab(2);
                                            }}
                                        >
                                            Content
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${key === 3 ? "active" : ""}`}
                                            data-toggle="tab"
                                            onClick={() => {
                                                setKey(3);
                                                saveCurrentTab(3);
                                            }}
                                        >
                                            Aside
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${key === 4 ? "active" : ""}`}
                                            data-toggle="tab"
                                            onClick={() => {
                                                setKey(4);
                                                saveCurrentTab(4);
                                            }}
                                        >
                                            Footer
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${key === 5 ? "active" : ""}`}
                                            data-toggle="tab"
                                            onClick={() => {
                                                setKey(5);
                                                saveCurrentTab(5);
                                            }}
                                        >
                                            Database
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="form">
                                <div className="card-body">
                                    <div className="tab-content pt-3">
                                        <div className={`tab-pane ${key === 0 ? "active" : ""}`}>
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Desktop Fixed Header:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="header.self.fixed.desktop"
                                                        checked={!!get(values, "header.self.fixed.desktop")}
                                                    />
                                                    <FormHelperText>
                                                        Enable fixed header for mobile mode
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Mobile Fixed Header:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="header.self.fixed.mobile"
                                                        checked={!!get(values, "header.self.fixed.mobile")}
                                                    />
                                                    <FormHelperText>
                                                        Enable fixed header for mobile mode
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Header Width:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <select
                                                        className="form-control form-control-solid"
                                                        name="header.self.width"
                                                        onBlur={handleBlur}
                                                        value={get(values, "header.self.width")}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="fluid">Fluid</option>
                                                        <option value="fixed">Fixed</option>
                                                    </select>
                                                    <FormHelperText>
                                                        Select header width type
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Display Header Menu:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="header.menu.self.display"
                                                        checked={!!get(values, "header.menu.self.display")}
                                                    />
                                                    <FormHelperText>Display header menu</FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Header Menu Layout:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <select
                                                        className="form-control"
                                                        name="header.menu.self.layout"
                                                        onBlur={handleBlur}
                                                        value={get(values, "header.menu.self.layout")}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="default">Default</option>
                                                        <option value="tab">Tab</option>
                                                    </select>
                                                    <FormHelperText>
                                                        Select header menu layout style
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Header Menu Arrows:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="header.menu.self.root-arrow"
                                                        checked={
                                                            !!get(values, "header.menu.self.root-arrow")
                                                        }
                                                    />
                                                    <FormHelperText>
                                                        Enable header menu root link arrows
                                                    </FormHelperText>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`tab-pane ${key === 1 ? "active" : ""}`}>
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Display Subheader:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="subheader.display"
                                                        checked={!!get(values, "subheader.display")}
                                                    />
                                                    <FormHelperText>
                                                        Display subheader
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Fixed Subheader:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="subheader.fixed"
                                                        checked={!!get(values, "subheader.fixed")}
                                                    />
                                                    <FormHelperText>
                                                        Enable fixed(sticky) subheader. Requires{" "}
                                                        <code>Solid</code> subheader style.
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Width:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <select
                                                        className="form-control"
                                                        name="subheader.width"
                                                        onBlur={handleBlur}
                                                        value={get(values, "subheader.width")}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="fluid">Fluid</option>
                                                        <option value="fixed">Fixed</option>
                                                    </select>
                                                    <FormHelperText>
                                                        Select layout width type
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Subheader Style:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <select
                                                        className="form-control"
                                                        name="subheader.style"
                                                        onBlur={handleBlur}
                                                        value={get(values, "subheader.style")}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="transparent">Transparent</option>
                                                        <option value="solid">Solid</option>
                                                    </select>
                                                    <FormHelperText>
                                                        Select subheader style
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                        </div>
                                        <div className={`tab-pane ${key === 2 ? "active" : ""}`}>
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Width:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <select
                                                        className="form-control"
                                                        name="content.width"
                                                        onBlur={handleBlur}
                                                        value={get(values, "content.width")}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="fluid">Fluid</option>
                                                        <option value="fixed">Fixed</option>
                                                    </select>
                                                    <FormHelperText>
                                                        Select layout width type
                                                    </FormHelperText>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`tab-pane ${key === 3 ? "active" : ""}`}>
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Display:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="aside.self.display"
                                                        checked={!!get(values, "aside.self.display")}
                                                    />
                                                    <FormHelperText>Display aside</FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Fixed:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="aside.self.fixed"
                                                        checked={!!get(values, "aside.self.fixed")}
                                                    />
                                                    <FormHelperText>
                                                        Set fixed aside layout
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Minimize:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="aside.self.minimize.toggle"
                                                        checked={
                                                            !!get(values, "aside.self.minimize.toggle")
                                                        }
                                                    />
                                                    <FormHelperText>
                                                        Allow aside minimizing
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Hoverable:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="aside.self.minimize.hoverable"
                                                        checked={
                                                            !!get(values, "aside.self.minimize.hoverable")
                                                        }
                                                    />
                                                    <FormHelperText>
                                                        Expand Minimized Aside on hover
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Default Minimize:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="aside.self.minimize.default"
                                                        checked={
                                                            !!get(values, "aside.self.minimize.default")
                                                        }
                                                    />
                                                    <FormHelperText>
                                                        Set aside minimized by default
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label
                                                    className="col-lg-3 col-form-label pt-4 text-lg-right">
                                                    Submenu Toggle:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="aside.menu.dropdown"
                                                        checked={!!get(values, "aside.menu.dropdown")}
                                                    />
                                                    <FormHelperText>
                                                        Select submenu toggle mode (works only when{" "}
                                                        <code>Fixed Mode</code> is disabled)
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                        </div>
                                        <div className={`tab-pane ${key === 4 ? "active" : ""}`}>
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Fixed Desktop Footer:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <Switch
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        name="footer.fixed"
                                                        checked={!!get(values, "footer.fixed")}
                                                    />

                                                    <FormHelperText>Set fixed desktop footer</FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Width:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <select
                                                        className="form-control form-control-solid"
                                                        name="footer.self.width"
                                                        onBlur={handleBlur}
                                                        value={get(values, "footer.self.width")}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="fluid">Fluid</option>
                                                        <option value="fixed">Fixed</option>
                                                    </select>
                                                    <FormHelperText>
                                                        Select layout width type
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                        </div>
                                        <div className={`tab-pane ${key === 5 ? "active" : ""}`}>
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Export Data:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                <button
                                                type="button"
                                                onClick={handleSubmit}
                                                className={`btn btn-secondary font-weight-bold mr-2`}
                                            >
                                                <i className="la la-down"/> Export
                                            </button>

                                                    <FormHelperText>Export Data in "json" file.</FormHelperText>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label text-lg-right">
                                                    Import Data:
                                                </label>
                                                <div className="col-lg-9 col-xl-4">
                                                    <input
                                                        className="form-control form-control-solid"
                                                        type="file"
                                                        onChange={handleData}
                                                    />
                                                    <FormHelperText>
                                                        Import "json" File Data
                                                    </FormHelperText>
                                                </div>
                                            </div>

                                        </div>
                                    
                                    </div>
                                </div>
                                {key !== 5 && (
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col-lg-3"></div>
                                        <div className="col-lg-9">
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                className={`btn btn-primary font-weight-bold mr-2`}
                                            >
                                                <i className="la la-eye"/> Preview
                                            </button>
                                            {" "}
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className={`btn btn-clean font-weight-bold mr-2`}
                                            >
                                                <i className="la la-recycle"/> Reset
                                            </button>
                                            {" "}
                                            <span
                                                className={`ml-3 ${clsx({
                                                    spinner: isLoading
                                                })}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Formik>
        </>
    );
}
