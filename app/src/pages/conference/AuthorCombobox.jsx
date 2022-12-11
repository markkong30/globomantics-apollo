import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { SPEAKERS } from './Speakers';
import classNames from 'classnames';
import { useCombobox } from 'downshift';
import './AuthorCombobox.css';

const AuthorCombobox = ({ data, speakers, setSpeakers, setSpeaker }) => {
	const [input, setInput] = useState('');

	useEffect(() => {
		if (data) {
			setSpeakers(data.speakers);
		}
	}, [data]);

	const {
		isOpen,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		selectedItem
	} = useCombobox({
		onSelectedItemChange: ({ inputValue }) =>
			setSpeaker(
				data.speakers.find((speaker) => speaker.name === inputValue).id
			),
		onInputValueChange({ inputValue }) {
			setSpeakers(data.speakers.filter(getSpeakersFilter(inputValue)));
			setInput(inputValue);
		},
		items: speakers,
		itemToString(speaker) {
			return speaker ? speaker.name : '';
		}
	});

	function getSpeakersFilter(inputValue) {
		return function speakersFilter(speaker) {
			return !inputValue || speaker.name.toLowerCase().includes(inputValue);
		};
	}

	if (!speakers || !data) return;

	return (
		<div>
			<div className="w-72 flex flex-col gap-1">
				<label className="w-fit" {...getLabelProps()}>
					Author
				</label>
				<div className="flex shadow-sm bg-white gap-0.5">
					<input
						placeholder="Type to search..."
						className="w-full p-1.5"
						{...getInputProps()}
					/>
					<button
						aria-label="toggle menu"
						className="px-2"
						type="button"
						{...getToggleButtonProps()}
					>
						{isOpen ? <>&#8593;</> : <>&#8595;</>}
					</button>
				</div>
			</div>
			<ul
				{...getMenuProps()}
				className={classNames('menu', !isOpen && 'menu-hidden')}
			>
				{isOpen &&
					input.length > 1 &&
					speakers.map((item, index) => (
						<li
							className={classNames(
								highlightedIndex === index && 'bg-info',
								selectedItem === item && 'fw-bold',
								'py-2 px-3 d-flex flex-col'
							)}
							key={`${item.value}${index}`}
							{...getItemProps({ item, index })}
						>
							<span className="fs-6 menu-item">{item.name}</span>
						</li>
					))}
			</ul>
		</div>
	);
};

export default AuthorCombobox;
