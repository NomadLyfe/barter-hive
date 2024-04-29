import { useContext, useState } from 'react';
import { Context } from './Context';
import { useFormik } from "formik";
import * as yup from "yup";
import upload from './images/upload.svg'
import no_pic from './images/no-profile-pic.png'

function NewPostOverlay() {
    const { user, setInactivityCount, setPosts, setUserposts, userpage, posts } = useContext(Context)
    const [showExtraInput, setShowExtraInput] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([]);

    function resetTimer() {
        setInactivityCount(0)
    }

    function handleOverlayClick(e) {
        const overlay = document.querySelector('.overlay')
        if (e.target == overlay) {
            const main = document.querySelector('main')
            const postForm = document.querySelector('.post-form')
            postForm.style.display = ''
            overlay.style.display = ''
            main.style.filter = ''
            setShowExtraInput(false)
            formik.resetForm();
        }
    }

    function handleTypeChange(e) {
        const selection = e.target.value
        setShowExtraInput(selection === 'Sale')
        formik.handleChange(e)
    }

    const formSchema = yup.object().shape({
        type: yup.string(),
        title: yup.string(),
        str_content: yup.string(),
        price: yup.number()
    });

    const formik = useFormik({
        initialValues: {
            type: '',
            str_content: '',
            pic_content: [],
            price: 0,
            userpage: false,
            userpage_id: null,
            post_num: posts.length
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            values.userpage = window.location.pathname != '/'
            values.userpage_id = values.userpage ? userpage.id : null
            fetch('/api/createpost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((posts) => {
                        setSelectedFiles([])
                        const overlay = document.querySelector('.overlay')
                        const main = document.querySelector('main')
                        const postForm = document.querySelector('.post-form')
                        postForm.style.display = ''
                        overlay.style.display = ''
                        main.style.filter = ''
                        if (values.userpage) {
                            setUserposts(posts)
                        } else {
                            setPosts(posts)
                        }
                    });
                } else {
                    resp.json().then((error) => {
                        alert(error.error)
                    });
                }
            }).catch((error) => {
                console.error('error:', error)
            })
            formik.resetForm();
        }
    });

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const files = [...e.dataTransfer.files];
        Array.from(files).forEach(file => {
            setSelectedFiles([...selectedFiles, file]);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                formik.setFieldValue('pic_content', [...(formik.values.pic_content || []), base64String]);
            };
            reader.readAsDataURL(file);
        });
    }

    function handleFileChange(e) {
        const files = e.target.files;
        Array.from(files).forEach(file => {
            setSelectedFiles([...selectedFiles, file]);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                formik.setFieldValue('pic_content', [...(formik.values.pic_content || []), base64String]);
            };
            reader.readAsDataURL(file);
        });
    }

    function removeFile(index) {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    }

    let filePreview = null
    if (selectedFiles[0]) {
        filePreview = selectedFiles.map((file, index) => (
            <div className="file-preview" key={index}>
                <img src={URL.createObjectURL(file)} alt="file-preview" />
                <button type="button" onClick={() => removeFile(index)}>Remove</button>
            </div>
        ))
    }

    return (
        <div className='overlay' onMouseDown={handleOverlayClick} onMouseMove={resetTimer}>
            <div className="post-form">
                <div className='createPostTitle'>
                    <h2>Create Post</h2>
                    <div></div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <img src={user.profile_pic ? `/api${user.profile_pic}` : no_pic} className="profile-pic" alt="profile pic" />
                    <select id="type" name="type" onChange={handleTypeChange} value={formik.values.type} >
                        <option value="Social">Social</option>
                        <option value="Sale">Sale</option>
                    </select>
                    {showExtraInput ? <input type='number' name='price' step='0.01' placeholder='Enter price' onChange={formik.handleChange} value={formik.values.price} /> : null}
                    <div className='image-drop' onDragOver={handleDragOver} onDrop={handleDrop}>
                        <label htmlFor='file-upload'>
                            <img src={upload} alt='add' />
                            {filePreview ? <h2>Add More Media</h2> : <h2>Add Media</h2>}
                            <p>or drag and drop</p>
                        </label>
                        <input id='file-upload' type='file' accept="image/*" onChange={handleFileChange} multiple />
                    </div>
                    <div className='file-preview-wrapper'>
                        {filePreview}
                    </div>
                    <textarea name='str_content' type='text' placeholder='Description' onChange={formik.handleChange} value={formik.values.str_content} />
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default NewPostOverlay