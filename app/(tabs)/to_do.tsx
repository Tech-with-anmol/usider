import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { ActivityIndicator } from 'react-native';

export default function ToDo() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [editTaskId, setEditTaskId] = useState<string | null>(null);
    const [editTaskText, setEditTaskText] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const tasks = await AsyncStorage.getItem('tasks');
            const sections = await AsyncStorage.getItem('sections');
            if (tasks !== null) {
                setTasks(JSON.parse(tasks));
            }
            if (sections !== null) {
                setSections(JSON.parse(sections));
            }
        } catch (error) {
            console.error(error);
        }
    };

    interface Task {
        id: string;
        text: string;
        completed: boolean;
    }

    interface Section {
        id: string;
        name: string;
        tasks: Task[];
        color: string;
    }

    const saveTasks = async (tasks: Task[]): Promise<void> => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error(error);
        }
    };

    const saveSections = async (sections: Section[]): Promise<void> => {
        try {
            await AsyncStorage.setItem('sections', JSON.stringify(sections));
        } catch (error) {
            console.error(error);
        }
    };

    const addTask = (sectionId: string) => {
        if (task.trim()) {
            const newTask = { id: Date.now().toString(), text: task, completed: false };
            const newSections = sections.map(section => 
                section.id === sectionId ? { ...section, tasks: [...section.tasks, newTask] } : section
            );
            setSections(newSections);
            saveSections(newSections);
            setTask('');
        }
    };

    const deleteTask = (sectionId: string, taskId: string) => {
        const newSections = sections.map(section => 
            section.id === sectionId ? { ...section, tasks: section.tasks.filter(task => task.id !== taskId) } : section
        );
        setSections(newSections);
        saveSections(newSections);
    };

    const deleteSection = (sectionId: string) => {
        const newSections = sections.filter(section => section.id !== sectionId);
        setSections(newSections);
        saveSections(newSections);
    };

    const toggleTaskCompletion = (sectionId: string, taskId: string) => {
        const newSections = sections.map(section => 
            section.id === sectionId ? { 
                ...section, 
                tasks: section.tasks.map(task => 
                    task.id === taskId ? { ...task, completed: !task.completed } : task
                ) 
            } : section
        );
        setSections(newSections);
        saveSections(newSections);
    };

    const startEditingTask = (taskId: string, text: string) => {
        setEditTaskId(taskId);
        setEditTaskText(text);
    };

    const saveEditedTask = () => {
        const newSections = sections.map(section => ({
            ...section,
            tasks: section.tasks.map(task => 
                task.id === editTaskId ? { ...task, text: editTaskText } : task
            )
        }));
        setSections(newSections);
        saveSections(newSections);
        setEditTaskId(null);
        setEditTaskText('');
    };

    const addSection = () => {
        if (newSectionName.trim()) {
            const newSection = { 
                id: Date.now().toString(), 
                name: newSectionName, 
                tasks: [], 
                color: getRandomColor() 
            };
            const newSections = [...sections, newSection];
            setSections(newSections);
            saveSections(newSections);
            setNewSectionName('');
        }
    };

    const getRandomColor = () => {
        const colors = ['#A3BE8C', '#BF616A', '#D8DEE9', '#81A1C1', '#B48EAD', '#EBCB8B', '#88C0D0', '#5E81AC', '#4C566A', '#3B4252', '#2E3440'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    if (!fontsLoaded) {
        <View style={styles.loadingcontainer}>
        return <ActivityIndicator size="large" color="#88C0D0" />;
        </View>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>To-Do List</Text>
            <TextInput
                style={styles.input}
                placeholder="Add a new section"
                placeholderTextColor="#888"
                value={newSectionName}
                onChangeText={setNewSectionName}
            />
            <TouchableOpacity style={styles.addButton} onPress={addSection}>
                <Text style={styles.addButtonText}>Add Section</Text>
            </TouchableOpacity>
            <FlatList
                data={sections}
                keyExtractor={item => item.id}
                renderItem={({ item: section }) => (
                    <View style={styles.sectionWrapper}>
                        <View style={[styles.sectionColorStripe, { backgroundColor: section.color }]} />
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{section.name}</Text>
                                <TouchableOpacity onPress={() => deleteSection(section.id)}>
                                    <Text style={styles.deleteButton}>Delete Section</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Add a new task"
                                placeholderTextColor="#888"
                                value={task}
                                onChangeText={setTask}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={() => addTask(section.id)}>
                                <Text style={styles.addButtonText}>Add Task</Text>
                            </TouchableOpacity>
                            {section.tasks.filter(task => !task.completed).length > 0 && (
                                <Text style={styles.sectionSubTitle}>Tasks</Text>
                            )}
                            <FlatList
                                data={section.tasks.filter(task => !task.completed)}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.taskContainer}>
                                        <TouchableOpacity onPress={() => toggleTaskCompletion(section.id, item.id)}>
                                            <View style={[styles.circle, item.completed && styles.completedCircle]} />
                                        </TouchableOpacity>
                                        <Text style={styles.taskText}>{item.text}</Text>
                                        <View style={styles.taskActions}>
                                            <TouchableOpacity onPress={() => startEditingTask(item.id, item.text)}>
                                                <Text style={styles.editButton}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deleteTask(section.id, item.id)}>
                                                <Text style={styles.deleteButton}>X</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                            {section.tasks.filter(task => task.completed).length > 0 && (
                                <Text style={styles.sectionSubTitle}>Completed</Text>
                            )}
                            <FlatList
                                data={section.tasks.filter(task => task.completed)}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.taskContainer}>
                                        <TouchableOpacity onPress={() => toggleTaskCompletion(section.id, item.id)}>
                                            <View style={[styles.circle, item.completed && styles.completedCircle]} />
                                        </TouchableOpacity>
                                        <Text style={[styles.taskText, styles.completedTaskText]}>
                                            {item.text}
                                        </Text>
                                        <View style={styles.taskActions}>
                                            <TouchableOpacity onPress={() => deleteTask(section.id, item.id)}>
                                                <Text style={styles.deleteButton}>X</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                )}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={editTaskId !== null}
                onRequestClose={() => setEditTaskId(null)}
            >
                <View style={styles.modalView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Edit task"
                        placeholderTextColor="#888"
                        value={editTaskText}
                        onChangeText={setEditTaskText}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={saveEditedTask}>
                        <Text style={styles.addButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
        backgroundColor: '#2E3440',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_500Medium',
        color: '#D8DEE9',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#3B4252',
        color: '#D8DEE9',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        fontFamily: 'Poppins_400Regular',
    },
    addButton: {
        backgroundColor: '#88C0D0',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#2E3440',
        fontFamily: 'Poppins_500Medium',
    },
    sectionWrapper: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    sectionColorStripe: {
        width: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    sectionContainer: {
        flex: 1,
        backgroundColor: '#3B4252',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_500Medium',
        color: '#D8DEE9',
    },
    sectionSubTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_500Medium',
        color: '#D8DEE9',
        marginTop: 10,
        marginBottom: 5,
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#4C566A',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    taskText: {
        color: '#D8DEE9',
        fontFamily: 'Poppins_400Regular',
        flex: 1,
        marginLeft: 10,
    },
    completedTaskText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    taskActions: {
        flexDirection: 'row',
    },
    editButton: {
        color: '#EBCB8B',
        fontFamily: 'Poppins_500Medium',
        marginRight: 10,
    },
    deleteButton: {
        color: '#BF616A',
        fontFamily: 'Poppins_500Medium',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D8DEE9',
    },
    completedCircle: {
        backgroundColor: '#88C0D0',
    },
});