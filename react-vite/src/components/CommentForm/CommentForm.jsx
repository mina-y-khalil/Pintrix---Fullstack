import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, editComment } from '../../redux/comments';
import { useModal } from '../../context/Modal';
import './CommentForm.css';

const CommentForm = ({ pinId, comment }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const currentUser = useSelector(state => state.session.user);
    const formRef = useRef(null);

    const [text, setText] = useState(comment ? comment.text : '');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                closeModal();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeModal]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!currentUser) {
            setErrors(['You must be logged in to submit a comment.']);
            return;
        }
        if (!text.trim()) {
            setErrors(['Text is required']);
            return;
        }

        try {
            if (comment) {
                await dispatch(editComment(comment.id, text));
            } else {
                await dispatch(createComment(pinId, text));
            }
            closeModal();
        } catch (res) {
            const data = await res.json();
            if (data?.errors?.includes("You have already commented on this pin.")) {
                setErrors(["You already submitted a comment on this pin."]);
            } else {
                setErrors(["Something went wrong."]);
            }
        }
    };

    return (
        <div className="comment-form-overlay">
            <form ref={formRef} onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Enter your comment..."
                />
                {errors.length > 0 && <div className="error">{errors[0]}</div>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CommentForm;
