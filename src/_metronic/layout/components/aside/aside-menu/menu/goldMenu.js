import React from 'react'
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_helpers";


export const GoldMenu = ({ getMenuItemActive}) => {
    return (
        <>
			{/* Gold -- Farm settings */}
			<li className="menu-section ">
					<h4 className="menu-text">Gold</h4>
					<i className="menu-icon flaticon-more-v2"></i>
				</li>
			{/*begin::1 Level*/}
			<li
				className={`menu-item menu-item-submenu ${getMenuItemActive(
					"/manage/g", true
				)}`}
				aria-haspopup="true"
				data-menu-toggle="hover"
			>
				<NavLink className="menu-link menu-toggle" to="/manage/g">
					<span className="svg-icon menu-icon">
						<SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
					</span>
					<span className="menu-text">Gold Management</span>
				</NavLink>
				<div className="menu-submenu">
					<i className="menu-arrow" />
					<ul className="menu-subnav">
						<li className="menu-item menu-item-parent" aria-haspopup="true">
							<span className="menu-link">
								<span className="menu-text">Gold Management</span>
							</span>
						</li>
						{/*begin::2 Level*/}
						<li
							className={`menu-item ${getMenuItemActive(
								"/manage/g/gold-purchase"
							)}`}
							aria-haspopup="true"
						>
							<NavLink className="menu-link" to="/manage/g/gold-purchase">
								<i className="menu-bullet menu-bullet-dot">
									<span />
								</i>
								<span className="menu-text">Gold Purchase</span>
							</NavLink>
						</li>
						{/*end::2 Level*/}
					</ul>
				</div>
			</li>
			{/*end::1 Level*/}
        </>
    )
}