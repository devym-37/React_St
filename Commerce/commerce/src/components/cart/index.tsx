import { createRef, SyntheticEvent, useRef } from "react";
import { CartType } from "../../graphql/cart";
import CartItem from "./item";

const CartList = ({ items }: { items: CartType[] }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const checkBoxRefs = items.map(() => createRef<HTMLInputElement>());

    const handleCheckBoxChanged = (e: SyntheticEvent) => {
        if (!formRef.current) return;
        const targetInput = e.target as HTMLInputElement;
        const data = new FormData(formRef.current);
        const selectedCount = data.getAll("select-item").length;

        if (targetInput.classList.contains("select-all")) {
            // select-all 선택시

            const allChecked = targetInput.checked;
            checkBoxRefs.forEach((inputElem) => {
                inputElem.current!.checked = allChecked;
            });
        } else {
            // 개별 아이템 선택시
            const allChecked = selectedCount === items.length;
            formRef.current.querySelector<HTMLInputElement>(".select-all")!.checked = allChecked;
        }
    };

    return (
        <div>
            <form ref={formRef} onChange={handleCheckBoxChanged}>
                <label>
                    <input className='select-all' name='select-all' type='checkbox' />
                    전체선택
                </label>
                <ul className='cart'>
                    {items.map((item, i) => (
                        <CartItem {...item} key={item.id} ref={checkBoxRefs[i]} />
                    ))}
                </ul>
            </form>
        </div>
    );
};

export default CartList;
