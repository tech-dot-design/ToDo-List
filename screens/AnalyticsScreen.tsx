import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useTasks } from '../context/TaskContext';
import { colors, layout, styles as globalStyles, typography } from '../styles/global';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { tasks } = useTasks();

  // Stats for Top Row
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(task => {
    if (!task.deadline || task.deadline === 'No deadline') return false;
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    deadlineDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return deadlineDate < today && !task.completed;
  }).length;

  // Dummy data for Line Chart (Task Trends)
  // This would ideally come from historical task data
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43], // Dummy task count over months
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Electric Blue
        strokeWidth: 2,
      },
    ],
  };

  // Data for Donut Chart (Priority Distribution)
  const lowPriority = tasks.filter(task => task.priority === 'Low').length;
  const mediumPriority = tasks.filter(task => task.priority === 'Medium').length;
  const highPriority = tasks.filter(task => task.priority === 'High').length;

  const pieChartData = [
    {
      name: 'Low',
      population: lowPriority,
      color: colors.limeGreen, // Using a vibrant accent
      legendFontColor: colors.white,
      legendFontSize: 14,
    },
    {
      name: 'Medium',
      population: mediumPriority,
      color: colors.electricBlue, // Using a vibrant accent
      legendFontColor: colors.white,
      legendFontSize: 14,
    },
    {
      name: 'High',
      population: highPriority,
      color: '#FF4D4D', // Red for High priority
      legendFontColor: colors.white,
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: colors.deepCharcoal,
    backgroundGradientTo: colors.deepCharcoal,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White text for labels
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`, // Lighter labels
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.headerText}>Analytics</Text>

      {/* Top Row (Stats) */}
      <View style={localStyles.statsContainer}>
        <View style={localStyles.statCard}>
          <Text style={localStyles.statNumber}>{totalTasks}</Text>
          <Text style={globalStyles.secondaryText}>Total Tasks</Text>
          <Text style={localStyles.trendText}>▲ 12%</Text>
        </View>
        <View style={localStyles.statCard}>
          <Text style={localStyles.statNumber}>{completedTasks}</Text>
          <Text style={globalStyles.secondaryText}>Completed</Text>
          <Text style={localStyles.trendText}>▲ 8%</Text>
        </View>
        <View style={localStyles.statCard}>
          <Text style={localStyles.statNumber}>{pendingTasks}</Text>
          <Text style={globalStyles.secondaryText}>Pending</Text>
          <Text style={localStyles.trendText}>▼ 5%</Text>
        </View>
      </View>

      {/* Center Stage (The Graph) */}
      <Text style={localStyles.sectionHeader}>Task Trends</Text>
      <View style={globalStyles.card}>
        <LineChart
          data={lineChartData}
          width={screenWidth - layout.padding * 2} // from globalStyles.container padding
          height={220}
          chartConfig={chartConfig}
          bezier // for spline chart
          style={localStyles.chartStyle}
        />
      </View>

      {/* Bottom Section (Activity Breakdown) */}
      <Text style={localStyles.sectionHeader}>Priority Breakdown</Text>
      <View style={globalStyles.card}>
        <PieChart
          data={pieChartData}
          width={screenWidth - layout.padding * 2}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 0]}
          absolute
          // Custom style for donut effect
          has  legend={false} // Hide default legend to create custom one
        />
        <View style={localStyles.legendContainer}>
          {pieChartData.map((slice, index) => (
            <View key={index} style={localStyles.legendItem}>
              <View style={[localStyles.legendColor, { backgroundColor: slice.color }]} />
              <Text style={globalStyles.bodyText}>{slice.name}: {slice.population}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: layout.margin,
  },
  statCard: {
    ...globalStyles.card,
    width: (screenWidth - layout.padding * 2 - layout.margin) / 2, // two cards per row
    alignItems: 'center',
    marginBottom: layout.margin,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    ...globalStyles.headerText,
    fontSize: 32,
    color: colors.electricBlue,
  },
  trendText: {
    ...globalStyles.secondaryText,
    fontSize: 12,
    marginTop: layout.padding / 2,
    color: colors.limeGreen, // Green for positive trend
  },
  sectionHeader: {
    ...globalStyles.bodyText,
    fontWeight: typography.heavy,
    fontSize: 20,
    marginTop: layout.margin,
    marginBottom: layout.padding,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    marginTop: layout.padding,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.padding / 2,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: layout.padding / 2,
  },
});
