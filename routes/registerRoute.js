app.post('/register', async (req, res) => {
try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });

} catch (err) {
    res.status(500).json({ error: 'Registration failed' });
}
});
