const assert = require('assert');
const { formatTime } = require('../js/utils');

function runTests() {
    console.log('Running tests for formatTime...');

    // Test case 1: 0 seconds
    assert.strictEqual(formatTime(0), '00:00:00', 'Should format 0 seconds correctly');

    // Test case 2: Less than a minute
    assert.strictEqual(formatTime(45), '00:00:45', 'Should format 45 seconds correctly');

    // Test case 3: Exactly a minute
    assert.strictEqual(formatTime(60), '00:01:00', 'Should format 60 seconds correctly');

    // Test case 4: More than a minute
    assert.strictEqual(formatTime(75), '00:01:15', 'Should format 75 seconds correctly');

    // Test case 5: Exactly an hour
    assert.strictEqual(formatTime(3600), '01:00:00', 'Should format 3600 seconds correctly');

    // Test case 6: More than an hour
    assert.strictEqual(formatTime(3661), '01:01:01', 'Should format 3661 seconds correctly');

    // Test case 7: Large value
    assert.strictEqual(formatTime(36000), '10:00:00', 'Should format 36000 seconds correctly');

    // Test case 8: Edge case with double digits
    assert.strictEqual(formatTime(59), '00:00:59', 'Should format 59 seconds correctly');
    assert.strictEqual(formatTime(3599), '00:59:59', 'Should format 3599 seconds correctly');

    console.log('All tests passed!');
}

try {
    runTests();
} catch (error) {
    console.error('Test failed!');
    console.error(error);
    process.exit(1);
}
