import React from 'react'
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_helpers";


export const EssentialsMenu = ({ getMenuItemActive}) => {
    return (
        <>
			{/* Manage -- Farm settings */}
			{/*begin::1 Level*/}
			<li
				className={`menu-item menu-item-submenu ${getMenuItemActive(
					"/manage/e", true
				)}`}
				aria-haspopup="true"
				data-menu-toggle="hover"
			>
				<NavLink className="menu-link menu-toggle" to="/manage/e">
					<span className="svg-icon menu-icon">
						<SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
					</span>
					<span className="menu-text">Essentials</span>
				</NavLink>
				<div className="menu-submenu">
					<i className="menu-arrow" />
					<ul className="menu-subnav">
						<li className="menu-item menu-item-parent" aria-haspopup="true">
							<span className="menu-link">
								<span className="menu-text">Essentials</span>
							</span>
						</li>
						{/*begin::2 Level*/}
						<li
							className={`menu-item ${getMenuItemActive(
								"/manage/e/counters"
							)}`}
							aria-haspopup="true"
						>
							<NavLink className="menu-link" to="/manage/e/counters">
								<i className="menu-bullet menu-bullet-dot">
									<span />
								</i>
								<span className="menu-text">Counters</span>
							</NavLink>
						</li>
						{/*end::2 Level*/}
						{/*begin::2 Level*/}
						<li
							className={`menu-item ${getMenuItemActive(
								"/manage/e/categories"
							)}`}
							aria-haspopup="true"
						>
							<NavLink className="menu-link" to="/manage/e/categories">
								<i className="menu-bullet menu-bullet-dot">
									<span />
								</i>
								<span className="menu-text">Categories</span>
							</NavLink>
						</li>
						{/*end::2 Level*/}
						{/*begin::3 Level*/}
						<li
							className={`menu-item ${getMenuItemActive(
								"/manage/e/suppliers"
							)}`}
							aria-haspopup="true"
						>
							<NavLink className="menu-link" to="/manage/e/suppliers">
								<i className="menu-bullet menu-bullet-dot">
									<span />
								</i>
								<span className="menu-text">Suppliers</span>
							</NavLink>
						</li>
						{/*end::3 Level*/}
					</ul>
				</div>
			</li>
			{/*end::1 Level*/}
        </>
    )
}