import React, { useEffect, useState } from 'react'
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

// react-bootstrap UI
import { Container, Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
// scss file
import './profile-view.scss';


export function ProfileView({ user, setUser, movies, onLoggedOut }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [error, setError] = useState('')


    const token = localStorage.getItem('token');
    const handleSubmit = (e) => {
        e.preventDefault();

        if (username) {
            { username.length < 4 && setError('Username must be longer than 4 characters') };
            const alphaNum = /^[0-9a-zA-Z]+$/;
            { !username.match(alphaNum) && setError('Username must contain letters and numbers') }
        } else {
            setUsername(user.Username);
            setError('Empty fields filled in with current info. Submit again!')
        }

        if (password) {
            { password.length < 6 && setError('Password must be longer than 6 characters') }
        } else {
            setPassword(user.Password);
            setError('Empty fields filled in with current info. Submit again!')
        }

        if (!email) {
            setEmail(user.Email);
            setError('Empty fields filled in with current info. Submit again!')
        }
        if (!birthday) {
            { user.Birthday ? setBirthday(moment.utc(user.Birthday).format('YYYY-MM-DD')) : setBirthday(null) }
        }

        axios.put(`https://avengers-database.herokuapp.com/users/${user.Username}`, {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log(response.data);
                setUser(response.data);
                window.open('/', '_self'); // the second argument '_self' is necessary so that the page will open in the current tab
            })
            .catch(e => {
                console.log('error updating the user')
            });
    }

    // useEffect(() => {
    //     user.FavoriteMovies.map(movieID => {
    //         let movie = movies.find(m => m._id === movieID)
    //         setFavoriteMovies([...favoriteMovies, movie.Username])
    //     })
    // }, [favoriteMovies, setFavoriteMovies, movies, user])


    const handleDelete = () => {
        axios.delete(`https://avengers-database.herokuapp.com/users/${user.Username}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log(response.data);
                onLoggedOut()
            })
            .catch(err => {
                console.error(err)
            });
    }


    return (
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <div>
                        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>Current Details</h1>
                        <div className="user-info">
                            <h5><span className="text-muted">Username:</span> {user.Username}</h5>
                            <h5><span className="text-muted">Email:</span> {user.Email}</h5>
                            {user.Birthday &&
                                <h5><span className="text-muted">Birthday:</span> {moment.utc(user.Birthday).format('MMMM Do YYYY')}</h5>
                            }
                            {user.FavoriteMovies.length > 0 && <h5><span className="text-muted">Favorited Movies</span>
                                <ul>{user.FavoriteMovies.map(movieId => {
                                    let movie = movies.find(m => m._id === movieId)
                                    return <li key={movieId}>{movie.Title}</li>
                                })}</ul>
                            </h5>
                            }
                        </div>
                    </div>
                </Col>
                <Col md={8} className="d-flex justify-content-center">
                    <Form className="update-form" onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>Update User</h1>
                        <FloatingLabel controlId="formUsername" label="Username" className="mb-3 mt-4">
                            <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
                        </FloatingLabel>
                        <FloatingLabel controlId="formPassword" label="Password" className="mb-3">
                            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
                        </FloatingLabel>
                        <FloatingLabel controlId="formEmail" label="Email" className="mb-3">
                            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
                        </FloatingLabel>
                        <FloatingLabel controlId="formBirthday" label="Birthday" className="mb-3">
                            <Form.Control type="date" value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="birthday" />
                        </FloatingLabel>
                        {error && <h5 style={{ color: "red", marginBottom: "40px" }}>{error}</h5>}
                        <div className="d-grid gap-2">
                            <Button size="lg" variant="success" type="submit">Submit</Button>
                        </div>
                        <Link to={'/'}>
                            <Button size="lg" variant="danger" className="mt-5 w-75" onClick={handleDelete}>Delete Account</Button>
                        </Link>
                    </Form>
                </Col>
            </Row>

        </Container>
    )
}

ProfileView.propTypes = {
    user: PropTypes.shape({
        Username: PropTypes.string.isRequired,
        Email: PropTypes.string.isRequired,
        Password: PropTypes.string.isRequired,
        Birthday: PropTypes.date,
        FavoriteMovies: PropTypes.array
    }).isRequired,
    setUser: PropTypes.func.isRequired,
}